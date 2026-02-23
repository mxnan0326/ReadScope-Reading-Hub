import os
import sys
import json
import requests
import datetime

# --- 配置 ---
FEISHU_APP_ID = "cli_a910798ea7b85cd5"
FEISHU_APP_SECRET = "P83VlWGlEDlaQKgJprOmCg15YNzSaUNq"
NODE_TOKEN = "MYIMb2H33aEV4Ss1cVycvLJXnkd"
TABLE_ID = "tbl5bNknHd7Pua4x"

# 路径配置
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
FRONTEND_DIR = os.path.join(PROJECT_ROOT, "frontend")
ASSETS_DIR = os.path.join(FRONTEND_DIR, "public", "images")
DATA_DIR = os.path.join(FRONTEND_DIR, "public")

os.makedirs(ASSETS_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)


# 1. 获取 tenant_access_token
def get_tenant_access_token():
    url = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal"
    resp = requests.post(url, json={"app_id": FEISHU_APP_ID, "app_secret": FEISHU_APP_SECRET})
    data = resp.json()
    if data.get("code") == 0:
        return data["tenant_access_token"]
    print("获取 token 失败:", data)
    sys.exit(1)


# 2. 分页获取全部记录
def fetch_all_records(token):
    base_url = f"https://open.feishu.cn/open-apis/bitable/v1/apps/{NODE_TOKEN}/tables/{TABLE_ID}/records"
    headers = {"Authorization": f"Bearer {token}"}
    all_items = []
    page_token = None

    while True:
        params = {"page_size": 100}
        if page_token:
            params["page_token"] = page_token

        resp = requests.get(base_url, headers=headers, params=params)
        data = resp.json()

        if data.get("code") != 0:
            print("获取记录失败:", data)
            sys.exit(1)

        items = data["data"].get("items", [])
        all_items.extend(items)
        print(f"  已获取 {len(all_items)} 条...")

        if data["data"].get("has_more"):
            page_token = data["data"]["page_token"]
        else:
            break

    return all_items


# 3. 下载飞书附件图片（使用专用 media 下载接口）
def download_cover(token, file_token, record_id):
    """
    飞书附件下载需要用 /open-apis/drive/v1/medias/{file_token}/download 接口，
    并携带 Authorization。file_token 从附件字段的 file_token 取。
    """
    url = f"https://open.feishu.cn/open-apis/drive/v1/medias/{file_token}/download"
    headers = {"Authorization": f"Bearer {token}"}
    try:
        resp = requests.get(url, headers=headers, timeout=20)
        if resp.status_code == 200:
            # 尝试从 Content-Type 判断扩展名
            content_type = resp.headers.get("Content-Type", "")
            ext = ".jpg"
            if "png" in content_type:
                ext = ".png"
            elif "gif" in content_type:
                ext = ".gif"
            elif "webp" in content_type:
                ext = ".webp"

            img_path = os.path.join(ASSETS_DIR, f"{record_id}{ext}")
            with open(img_path, "wb") as f:
                f.write(resp.content)
            print(f"    ✓ 封面图下载成功: {record_id}{ext}")
            return f"/images/{record_id}{ext}"
        else:
            print(f"    ✗ 封面图下载失败 HTTP {resp.status_code}: {record_id}")
    except Exception as e:
        print(f"    ✗ 封面图下载异常: {record_id} -> {e}")
    return ""


# 4. 提取纯文本字段
def extract_text(field_data):
    if not field_data:
        return ""
    if isinstance(field_data, str):
        return field_data
    if isinstance(field_data, list):
        parts = []
        for item in field_data:
            if isinstance(item, dict):
                parts.append(item.get("text", ""))
            elif isinstance(item, str):
                parts.append(item)
        return "".join(parts)
    return str(field_data)


def main():
    print("Step 1: 获取 access token...")
    token = get_tenant_access_token()

    print("Step 2: 分页拉取所有记录...")
    raw_records = fetch_all_records(token)
    print(f"共获取 {len(raw_records)} 条记录\n")

    formatted_data = []

    for idx, item in enumerate(raw_records, 1):
        record_id = item["record_id"]
        fields = item.get("fields", {})

        status = extract_text(fields.get("状态"))
        if status != "已发布":
            title_text = extract_text(fields.get("标题"))
            print(f"[{idx}/{len(raw_records)}] 未发布，跳过: {title_text[:30]}")
            continue

        title = extract_text(fields.get("标题"))
        guest = extract_text(fields.get("嘉宾"))

        # 链接
        link_field = fields.get("原内容链接")
        original_link = ""
        if isinstance(link_field, dict):
            original_link = link_field.get("link", "")
        elif isinstance(link_field, list) and link_field:
            # 有时返回 [{text, link}] 结构
            first = link_field[0]
            original_link = first.get("link", first.get("text", "")) if isinstance(first, dict) else str(first)
        elif isinstance(link_field, str):
            original_link = link_field

        # 发布时间
        publish_time_raw = fields.get("发布时间")
        if isinstance(publish_time_raw, (int, float)):
            publish_date = datetime.datetime.fromtimestamp(
                publish_time_raw / 1000
            ).strftime("%Y-%m-%d")
        else:
            publish_date = str(publish_time_raw or "")

        source_platform = extract_text(fields.get("来源平台"))

        # 标签
        tags_raw = fields.get("标签")
        tags = []
        if isinstance(tags_raw, list):
            for t in tags_raw:
                if isinstance(t, dict):
                    tags.append(t.get("name", t.get("text", "")))
                elif isinstance(t, str):
                    tags.append(t)
        elif isinstance(tags_raw, str):
            tags = [t.strip() for t in tags_raw.split(",") if t.strip()]

        # 摘要
        summary = extract_text(fields.get("摘要正文"))

        # 金句
        quotes = []
        for key in ["金句1", "金句2", "金句3", "金句4", "金句5"]:
            q = extract_text(fields.get(key))
            if q.strip():
                quotes.append(q.strip())

        # 封面图 —— 检查本地缓存或下载
        cover_image = ""
        # 1. 先检查本地是否存在以 record_id 开头的文件 (例如 .jpg, .png)
        existing_images = [f for f in os.listdir(ASSETS_DIR) if f.startswith(record_id) and f.lower().endswith(('.jpg', '.png', '.gif', '.webp'))]
        if existing_images:
            # 找到缓存，直接使用缓存
            cover_image = f"/images/{existing_images[0]}"
            print(f"[{idx}/{len(raw_records)}] 封面图已存在，跳过下载: {title[:30]}")
        else:
            # 2. 如果不存在且有飞书附件，则执行下载
            cover_field = fields.get("封面图")
            if isinstance(cover_field, list) and cover_field:
                file_token = cover_field[0].get("file_token") or cover_field[0].get("token")
                if file_token:
                    print(f"[{idx}/{len(raw_records)}] 下载封面图: {title[:30]}...")
                    cover_image = download_cover(token, file_token, record_id)
                else:
                    print(f"[{idx}/{len(raw_records)}] 无 file_token，跳过封面图: {title[:30]}")
            else:
                pass

        formatted_data.append({
            "id": record_id,
            "title": title,
            "guest": guest,
            "original_link": original_link,
            "publish_date": publish_date,
            "source_platform": source_platform,
            "tags": tags,
            "summary": summary,
            "quotes": quotes,
            "cover_image": cover_image,
        })

    # 保存 JSON
    json_path = os.path.join(DATA_DIR, "data.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(formatted_data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ 同步完成！共 {len(formatted_data)} 条 → {json_path}")
    has_cover = sum(1 for d in formatted_data if d["cover_image"])
    print(f"   封面图下载成功: {has_cover} 张 / {len(formatted_data)} 条")


if __name__ == "__main__":
    main()
