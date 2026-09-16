@echo off
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
if not exist .env copy .env.example .env
cd ..\frontend
npm install
if not exist .env copy .env.example .env
echo Setup complete.
