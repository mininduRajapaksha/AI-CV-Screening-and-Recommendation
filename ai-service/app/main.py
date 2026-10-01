from fastapi import FastAPI

from app.routes.processing import router as processing_router


app = FastAPI(
    title="CVision AI Microservice",
    description="AI processing service for CV screening",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "CVision AI Microservice is running!"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


app.include_router(
    processing_router,
    prefix="/api/v1"
)