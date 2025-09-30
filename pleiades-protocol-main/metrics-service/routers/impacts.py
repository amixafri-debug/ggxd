from fastapi import APIRouter 
from routers import impact_energy,impact_effects 

router = APIRouter(
    prefix="/impacts",

)

router.include_router(impact_energy.router)
router.include_router(impact_effects.router)




