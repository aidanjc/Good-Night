# app.py
import time
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

@app.get('/api/sleep-quality')
def sleep_quality_get():
    sleep_quality = int(df["Sleep Quality"].iloc[-1].split("%")[0])
    return jsonify(sleepQuality=sleep_quality)

@app.get('/api/time-asleep')
def time_asleep_get():
    time_asleep_s = df["Time asleep (seconds)"].iloc[-1]
    time_asleep_hm = time.strftime('%Hh %Mm', time.gmtime(time_asleep_s))
    return jsonify(timeAsleep=time_asleep_hm)

# TODO: fix bed time
# start + time before sleep ?
@app.get('/api/bed-time')
def bed_time_get():
    bed_time = df["Start"].iloc[-1].split(" ")[1] # gets HH:MM:SS
    bed_time = bed_time[:-3] # gets HH:MM
    return jsonify(bedTime=bed_time)

@app.get('/api/wake-time')
def wake_time_get():
    wake_time = df["End"].iloc[-1].split(" ")[1] # gets HH:MM:SS
    wake_time = wake_time[:-3] # gets HH:MM
    return jsonify(wakeTime=wake_time)

@app.get('/api/sleep-rec')
def sleep_rec_get():
    # get list of sleep recommendations
    #sleep_recs = get_sleep_recommendations(df)
    # get highest ranking recommendation
    #sleep_rec = sleep_recs[0]
    #return jsonify(sleepRec=sleep_rec)
    
    # dummy data
    sleep_rec_title = "Maintaining a Consistent Bedtime"

    sleep_rec_content = ("Keeping a regular sleep schedule"
        " helps to maintain the timing of the body’s internal"
        " clock and can help you fall asleep and wake up more easily."
        " To ensure a consistent bedtime, try setting"
        " reminders for yourself to go to bed around"
        " the same time every night.")

    return jsonify(
        sleepRecTitle=sleep_rec_title,
        sleepRecContent=sleep_rec_content
        )

if __name__ == "__main__":
    app.run(host=ip, debug=True)
