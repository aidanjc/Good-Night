# app.py
import time
from sleeper import get_sleep_data, SleepData
from flask import Flask, jsonify

app = Flask(__name__)

# TODO - replace 'localhost' by doing the following
#   1. cd to Good-Night/app/
#   2. run expo start
#   3. find the ip address directly below the QR code
#   4. replace 'localhost' with everything between
#       'exp://' and ':' from the ip below the QR code
#ip = "localhost"
#ip = "192.168.1.143"
ip = "169.234.25.4"

# csv sleep data to pandas DataFrame
df = get_sleep_data('sleepdata.csv')

# SleepData obj
sleep_obj = SleepData(df)

@app.get('/api/sleep-quality')
def sleep_quality_get():
    sleep_quality = sleep_obj.yesterday_sleep_quality
    return jsonify(sleepQuality=sleep_quality)

@app.get('/api/time-asleep')
def time_asleep_get():
    time_asleep_hm = sleep_obj.yesterday_time_asleep_hm
    return jsonify(timeAsleep=time_asleep_hm)

@app.get('/api/sleep-start')
#def bed_time_get():
def sleep_start_get():
    #bed_time = df["Start"].iloc[-1].split(" ")[1] # gets HH:MM:SS
    #bed_time = bed_time[:-3] # gets HH:MM
    #return jsonify(bedTime=bed_time)
    sleep_start = sleep_obj.yesterday_sleep_start
    return jsonify(sleepStart=sleep_start)

@app.get('/api/sleep-end')
#def wake_time_get():
def sleep_end_get():
    #wake_time = df["End"].iloc[-1].split(" ")[1] # gets HH:MM:SS
    #wake_time = wake_time[:-3] # gets HH:MM
    #return jsonify(wakeTime=wake_time)
    sleep_end = sleep_obj.yesterday_sleep_end
    return jsonify(sleepEnd=sleep_end)

@app.get('/api/top-sleep-rec')
def top_sleep_rec_get():
    sleep_recs = sleep_obj.get_sleep_recommendations() # get list of sleep recs
    top_sleep_rec = sleep_recs[0] # get highest ranking recommendation
    return jsonify(topSleepRec=top_sleep_rec)

@app.get('/api/sleep-rec-list')
def sleep_rec_list_get():
    sleep_rec_list = sleep_obj.get_sleep_recommendations() # get list of sleep recs
    return jsonify(sleepRecList=sleep_rec_list)

@app.get('/api/diet-rec-list')
def diet_rec_list_get():
    diet_rec_list = sleep_obj.get_diet_recommendations() # get list of diet recs
    return jsonify(dietRecList=diet_rec_list)

@app.get('/api/exercise-rec-list')
def exercise_rec_list_get():
    exercise_rec_list = sleep_obj.get_exercise_recommendations() # get list of exercise recs
    return jsonify(exerciseRecList=exercise_rec_list)
    
@app.get('/api/date-recorded')
def date_recorded_get():
    # gets the date of the sleep log
    months = ["January", "February", "March", "April", 
              "May", "June", "July", "August",
              "September", "October", "November", "December"]
    date_recorded = df["Start"].iloc[-1].split(" ")[0] # gets YYYY-MM-DD
    year, month, day = [int(i) for i in date_recorded.split("-")]
    month = months[month-1]
    date = f"{month} {day}, {year}"
    return jsonify(dateRecorded=date)

if __name__ == "__main__":
    app.run(host=ip, debug=True)
