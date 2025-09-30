from pydantic import BaseModel 


class ImpactRequest(BaseModel):
    diameter_m : float 
    velocity_mps : float 
    density_kgm3 : float 
    shape_factor : float 
    porosity: float 

class KineticEnergyResponse(BaseModel):
    energy : float 
    energy_mt : float

class FireballRequest(BaseModel): 
    energy : float  

class FireballResponse(BaseModel): 
    fireball : float

class ThermalExposureAtDistanceRequest(BaseModel): 
    energy: float 
    horizontal_distance_m: float
    k_atenuacion: float 
    burst_altitude_m: float
    eta: float 

class ThermalExposureAtDistanceResponse(BaseModel):
    thermal_exposure: float 



    
    