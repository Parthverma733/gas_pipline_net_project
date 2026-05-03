@echo off

start cmd /k "cd frontend && npm i && npm i axios && npm run dev"
start cmd /k "cd backend && pip install -r requirnments.txt && uvicorn main:app --reload"
