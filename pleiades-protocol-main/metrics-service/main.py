from fastapi import FastAPI, Depends
from routers import population, impacts
from services.validation import get_api_key



app = FastAPI(title="Asteroids Metrics Service",
              version="1.0.0",
              description="Service to provide various metrics for asteroid impact scenarios.",
              dependencies=[Depends(get_api_key)],
              contact={
                "name": "Pleiades Protocol Team"
                }
              )

app.include_router(population.router)
app.include_router(impacts.router)



@app.get("/", tags=["helper"], response_model=dict[str, str],
         summary="List all endpoints")
async def root():
    tags = {}
    for route in app.router.__dict__["routes"]:
        if hasattr(route, "tags"):
            tags[route.__dict__["path"]] = route.__dict__["summary"]
    return tags

