# app.py
import time
import math
from sleeper import get_sleep_data, SleepData
from flask import Flask, jsonify

app = Flask(__name__)

# TODO - replace 'localhost' by doing the following
#   1. cd to Good-Night/app/
#   2. run expo start
#   3. find the ip address directly below the QR code
#   4. replace 'localhost' with everything between
#       'exp://' and ':' from the ip below the QR code
ip = "http://127.0.0.1:5000/"

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

@app.get('/api/sleep-rec')
def sleep_rec_get():
    # get list of sleep recommendations
    #sleep_recs = get_sleep_recommendations(df)
    # get highest ranking recommendation
    #sleep_rec = sleep_recs[0]
    #return jsonify(sleepRec=sleep_rec)
    sleep_recs = sleep_obj.get_sleep_recommendations() # get list of sleep recs
    sleep_rec = sleep_recs[0] # get highest ranking recommendation
    return jsonify(sleepRec=sleep_rec)

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

@app.get('/api/avg-time-in-bed')
def avg_time_in_bed_get():
    time = sleep_obj.avg_bedTime
    mins, hours = math.modf(time / 3600)
    hours = int(hours)
    mins = math.floor(mins * 60) 
    time = f"{hours}h {mins}mins"
    return jsonify(avgTimeInBed=time)

@app.get('/api/avg-step-count')
def avg_step_count_get():
    count = math.ceil(sleep_obj.avg_steps)
    return jsonify(stepCount=count)

@app.get('/api/avg-time-before-sleep')
def avg_time_before_sleep_get():
    time = sleep_obj.avg_time_before_sleep
    mins, hours = math.modf(time / 3600)
    hours = int(hours)
    mins = math.floor(mins * 60) 
    time = f"{hours}h {mins}mins" if hours > 0 else f"{mins}mins"
    return jsonify(timeBeforeSleep=time)

@app.get('/api/get-dates-past-7-logs')
def dates_past_7_logs_get():
    logs = sleep_obj.last_7_logs
    return jsonify(past7Logs = logs)
    
@app.get('/api/get-time-asleep-past-7-logs')
def time_asleep_past_7_logs_get():
    time_asleep = sleep_obj.past_7_logs_time_asleep
    return jsonify(sleepTime7Logs = time_asleep)

@app.get('/api/get-steps-last-7-logs')
def steps_last_7_logs():
    steps = sleep_obj.last_7_logs_steps
    return jsonify(steps7Logs = steps)

@app.get('/api/get-sleep-quality-last-7-logs')
def sleep_quality_last_7_logs():
    sleep_quality = sleep_obj.last_7_logs_sleep_quality
    return jsonify(sleepQuality7Logs = sleep_quality)

@app.get('/api/get-last-7-logs-before-sleep')
def time_before_sleep_7_logs():
    time_before_sleep = sleep_obj.avg_7days_time_before_sleep
    mins, hours = math.modf(time_before_sleep / 3600)
    hours = int(hours)
    mins = math.floor(mins * 60) 
    time_before_sleep = f"{hours}h {mins}mins" if hours > 0 else f"{mins}mins"
    return jsonify(timeBeforeSleep = time_before_sleep)

@app.get('/api/get-last-7-logs-steps')
def steps_7_logs():
    steps = sleep_obj.avg_7days_steps
    return jsonify(steps=int(steps))

@app.get('/api/get-last-30-logs-steps')
def steps_30_logs():
    steps = sleep_obj.avg_30days_steps
    return jsonify(steps=int(steps))

@app.get('/api/get-sleep-qualities')
def sleep_qualities():
    sq7 = "%.2f" % round(sleep_obj.avg_7days_sleep_quality, 2)
    sq30 = "%.2f" % round(sleep_obj.avg_30days_sleep_quality, 2)
    sleep = [sq7, sq30]
    return jsonify(sleep=sleep)

@app.get('/api/get-last-30-logs-time-before-sleep')
def time_before_sleep_30_logs():
    time_before_sleep = sleep_obj.avg_30days_time_before_sleep
    mins, hours = math.modf(time_before_sleep / 3600)
    hours = int(hours)
    mins = math.floor(mins * 60) 
    time_before_sleep = f"{hours}h {mins}mins" if hours > 0 else f"{mins}mins"
    return jsonify(timeBeforeSleep=time_before_sleep)

@app.get('/api/get-last-30-logs-time-in-bed')
def time_in_bed_30_logs():
    time_in_bed = sleep_obj.avg_30days_bedTime
    mins, hours = math.modf(time_in_bed / 3600)
    hours = int(hours)
    mins = math.floor(mins * 60) 
    time_in_bed = f"{hours}h {mins}mins" if hours > 0 else f"{mins}mins"
    return jsonify(timeInBed=time_in_bed)

if __name__ == "__main__":
    app.run(host=ip, debug=True)
