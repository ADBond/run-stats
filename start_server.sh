#!/bin/bash
source virtual-env/Scripts/activate
FLASK_ENV=development FLASK_APP=server flask run
