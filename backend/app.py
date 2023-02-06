# app.py
from flask import Flask, jsonify
from sleep import get_sleep_data, get_sleep_recommendations

app = Flask(__name__)

# TODO - replace 'localhost' by doing the following
#   1. cd to Good-Night/app/
#   2. run expo start
#   3. find the ip address directly below the QR code
#   4. replace 'localhost' with everything between
#       'exp://' and ':' from the ip below the QR code
ip = "localhost"

# get pandas dataframe of sleep data
df = get_sleep_data('sleepdata.csv')

# get list of sleep recommendations
recs = get_sleep_recommendations(df)

@app.get('/api/sleep-quality')
def sleep_quality_get():
    sleep_quality = int(df["Sleep Quality"].iloc[-1].split("%")[0])
    return jsonify(sleepQuality=sleep_quality)

if __name__ == "__main__":
    app.run(host=ip, debug=True)
