#!/bin/bash
ENV_NAME="virtual-env"
if [ -d "./$ENV_NAME" ]; then
    echo "Activating environment"
    source "./$ENV_NAME/Scripts/activate"
else
    echo "Creating virtual environment"
    python -m venv "$ENV_NAME"
    python -m pip install -U pip
    python -m pip install --upgrade pip
    pip install -r requirements.txt
    source "./$ENV_NAME/Scripts/activate"
fi