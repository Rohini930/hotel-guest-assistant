#!/bin/bash
set -e
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
[ -f .env ] || cp .env.example .env
cd ../frontend
npm install
[ -f .env ] || cp .env.example .env
echo Setup complete.
