from fastapi import APIRouter
from pydantic import BaseModel
import requests

router = APIRouter(prefix='/strava')

STRAVA_API_ROOT_URL = 'https://www.strava.com/api/v3'
STRAVA_CLIENT_ID = '27346'
STRAVA_CLIENT_SECRET = '4b24ee8b01a912913acd6fde8d5be511763979aa'


@router.get("/activity")
def get_activity_data(activity_id: str, athlete_id: str):
    request_url = f'{STRAVA_API_ROOT_URL}/activities/{activity_id}/streams?keys=latlng,altitude'
    access_token = _access_token_for_athlete(athlete_id)
    headers = {'Authorization': f'Bearer {access_token}'}
    response = requests.get(request_url, headers=headers)

    data_map = {}
    for field in response.json():
        data_map[field['type']] = field['data']

    return data_map


@router.get("/token/exchange")
def exchange_token(state: str, code: str, scope: str):   
    request_url = 'https://www.strava.com/oauth/token'
    request_body = {
        'client_id': STRAVA_CLIENT_ID,
        'client_secret': STRAVA_CLIENT_SECRET,
        'code': code,
        'grant_type': 'authorization_code'
    }
    response = requests.post(request_url, json=request_body)
    print(response.json())


@router.get("/token/refresh")
def refresh_token(account_id: str):
    request_url = 'https://www.strava.com/oauth/token'
    refresh_token = _refresh_token_for_account_id(account_id)
    request_body = {
        'client_id': STRAVA_CLIENT_ID,
        'client_secret': STRAVA_CLIENT_SECRET ,
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token
    }
    response = requests.post(request_url, json=request_body)
    print(response.json())


def _access_token_for_athlete(athlete_id):
    return '54dde028380247719a67606b43792e74f6c42585'


def _refresh_token_for_account_id(account_id):
    return '47967760f450526c39e4c025fb82324805446022'