from fastapi import FastAPI, Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from collections import defaultdict
from typing import Dict
import time

app = FastAPI()


class AdvancedMiddleware(BaseHTTPMiddleware):

    def __init__(self, app):
        super().__init__(app)
        self.rate_limit_records: Dict[str, float] = defaultdict(float)

    async def log_message(self, message: str):
        print(message)

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        current_time = time.time()

        if current_time - self.rate_limit_records[client_ip] < 1:
            return Response(content="Rate limit exceeded", status_code=429)

        self.rate_limit_records[client_ip] = current_time
        path = request.url.path
        await self.log_message(f"Request to {path}")

        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time

        custom_header = {"X-Process-Time": str(process_time)}
        for header, value in custom_header.items():
            response.headers[header] = value

        await self.log_message(
            f"Response f rom {path} took {process_time:.4f} seconds")
        return response


app.add_middleware(AdvancedMiddleware)


@app.get("/")
async def say_hi():
    return 'Hello World!'
