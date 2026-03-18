import urllib.request


def status(url: str, method: str = "GET", timeout: int = 20) -> int:
    req = urllib.request.Request(url, method=method)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.status


print("health", status("http://127.0.0.1:8000/health"))
print("refresh", status("http://127.0.0.1:8000/api/v1/news/refresh", method="POST", timeout=45))
print("news", status("http://127.0.0.1:8000/api/v1/news?limit=3"))
print("search", status("http://127.0.0.1:8000/api/v1/news/search?q=agents"))
print("admin", status("http://127.0.0.1:8000/api/v1/admin/sources"))
