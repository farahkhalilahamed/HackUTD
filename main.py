from fastapi import FastAPI
from app.routes import upload, dashboard, profile

app = FastAPI(title="EcoData Snap API", version="1.0")

# Include routes for each tab
app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(profile.router, prefix="/profile", tags=["Profile"])

@app.get("/")
def root():
    return {"message": "Welcome to EcoData Snap Backend"}
