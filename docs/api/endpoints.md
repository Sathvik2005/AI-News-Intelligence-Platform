# API Endpoints

## Health
- `GET /health`

## News
- `GET /api/v1/news?limit=50&offset=0&q=&topic=&company=`
- `GET /api/v1/news/{news_id}`
- `POST /api/v1/news/refresh`
- `GET /api/v1/news/search?q=latest multimodal models`

## Favorites
- `GET /api/v1/favorites?user_id=<uuid>`
- `POST /api/v1/favorites`
- `DELETE /api/v1/favorites/{favorite_id}`

## Trends
- `GET /api/v1/trends`
- `GET /api/v1/trends/industry-pulse`

## Broadcast
- `POST /api/v1/broadcast/email`
- `POST /api/v1/broadcast/linkedin`
- `POST /api/v1/broadcast/whatsapp`
- `POST /api/v1/broadcast/newsletter`

## Streaming
- `GET /api/v1/stream`

## Admin
- `GET /api/v1/admin/sources`
- `POST /api/v1/admin/sources`
- `POST /api/v1/admin/refresh`
