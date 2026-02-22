import requests
import json

FEISHU_APP_ID = "cli_a910798ea7b85cd5"
FEISHU_APP_SECRET = "P83VlWGlEDlaQKgJprOmCg15YNzSaUNq"
NODE_TOKEN = "QxZowDODyiYt9bkaBKucDZNInmd"
TABLE_ID = "tbl5bNknHd7Pua4x"

# 1. 获取 tenant_access_token
url = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal"
payload = {
    "app_id": FEISHU_APP_ID,
    "app_secret": FEISHU_APP_SECRET
}
response = requests.post(url, json=payload)
data = response.json()
print("Token Response:", data)

if data.get("code") == 0:
    token = data["tenant_access_token"]
    
    # 2. 获取节点对应的 bitable info (如果是Wiki node token)
    # 或者直接尝试用 node_token 获取 records
    records_url = f"https://open.feishu.cn/open-apis/bitable/v1/apps/{NODE_TOKEN}/tables/{TABLE_ID}/records"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    res = requests.get(records_url, headers=headers)
    print("Records Response Code:", res.status_code)
    try:
        print("Records Preview:", json.dumps(res.json(), ensure_ascii=False)[:500])
        print("Fields:")
        if 'items' in res.json().get('data', {}):
            if len(res.json()['data']['items']) > 0:
                print(res.json()['data']['items'][0].get("fields", {}).keys())
    except Exception as e:
        print(e)
