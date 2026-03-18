from app.schemas.api import BroadcastRequest


def build_broadcast_payload(channel: str, payload: BroadcastRequest) -> str:
    if channel == "linkedin":
        return (
            f"🚀 Major AI Update\n\n"
            f"{payload.title}\n\n"
            f"{payload.summary}\n\n"
            f"Read more: {payload.url}\n"
            f"#AI #MachineLearning #TechNews"
        )

    if channel == "email":
        return (
            f"Subject: AI News Brief - {payload.title}\n\n"
            f"Summary: {payload.summary}\n"
            f"Link: {payload.url}"
        )

    if channel == "whatsapp":
        return f"AI update: {payload.title}\n{payload.url}"

    if channel == "newsletter":
        return f"## {payload.title}\n\n{payload.summary}\n\nRead: {payload.url}"

    return f"# {payload.title}\n\n{payload.summary}\n\nSource: {payload.url}"
