# app.py
import time
import math
import sleeper
from flask import Flask, request, jsonify

app = Flask(__name__)

# TODO - replace 'localhost' by doing the following
#   1. cd to Good-Night/app/
#   2. run expo start
#   3. find the ip address directly below the QR code
#   4. replace 'localhost' with everything between
#       'exp://' and ':' from the ip below the QR code
ip = "localhost"

# csv sleep data to pandas DataFrame
sleep_df = sleeper.get_sleep_data('sleepdata.csv')

# csv food data to pandas DataFrame
food_df = sleeper.get_food_data('10000_recipes.csv')

personal_model = sleeper.PersonalModel(sleep_df, food_df)

@app.post('/api/signup')
def signup_post():
    # get user input from signup screen
    data = request.get_json()
    personal_model.get_user_input(data['gender'], 
                                  int(data['breakfastCalories']), 
                                  int(data['lunchCalories']), 
                                  data['diet'], 
                                  float(data['height']), 
                                  float(data['weight']), 
                                  int(data['age'])
                                  )
    personal_model.build_personal_model()
    return data

@app.get('/api/sleep-quality')
def sleep_quality_get():
    sleep_quality = personal_model.yesterday_sleep_quality
    return jsonify(sleepQuality=sleep_quality)

@app.get('/api/time-asleep')
def time_asleep_get():
    time_asleep_hm = personal_model.yesterday_time_asleep_hm
    return jsonify(timeAsleep=time_asleep_hm)

@app.get('/api/sleep-start')
#def bed_time_get():
def sleep_start_get():
    sleep_start = personal_model.yesterday_sleep_start
    return jsonify(sleepStart=sleep_start)

@app.get('/api/sleep-end')
#def wake_time_get():
def sleep_end_get():
    sleep_end = personal_model.yesterday_sleep_end
    return jsonify(sleepEnd=sleep_end)

@app.get('/api/top-sleep-rec')
def top_sleep_rec_get():
    sleep_recs = personal_model.get_sleep_recommendations() # get list of sleep recs
    top_sleep_rec = sleep_recs[0] # get highest ranking recommendation
    return jsonify(topSleepRec=top_sleep_rec)

@app.get('/api/sleep-rec-list')
def sleep_rec_list_get():
    sleep_rec_list = personal_model.get_sleep_recommendations() # get list of sleep recs
    return jsonify(sleepRecList=sleep_rec_list)

@app.get('/api/diet-rec-list')
def diet_rec_list_get():
    diet_rec_list = personal_model.get_diet_recommendations() # get list of diet recs
    return jsonify(dietRecList=diet_rec_list)

@app.get('/api/exercise-rec-list')
def exercise_rec_list_get():
    exercise_rec_list = personal_model.get_exercise_recommendations() # get list of exercise recs
    return jsonify(exerciseRecList=exercise_rec_list)
    
@app.get('/api/date-recorded')
def date_recorded_get():
    # gets the date of the sleep log
    months = ["January", "February", "March", "April", 
              "May", "June", "July", "August",
              "September", "October", "November", "December"]
    date_recorded = sleep_df["Start"].iloc[-1].split(" ")[0] # gets YYYY-MM-DD
    year, month, day = [int(i) for i in date_recorded.split("-")]
    month = months[month-1]
    date = f"{month} {day}, {year}"
    return jsonify(dateRecorded=date)

@app.get('/api/avg-time-in-bed')
def avg_time_in_bed_get():
    time = personal_model.avg_bedTime
    mins, hours = math.modf(time / 3600)
    hours = int(hours)
    mins = math.floor(mins * 60) 
    time = f"{hours}h {mins}mins"
    return jsonify(avgTimeInBed=time)

@app.get('/api/avg-step-count')
def avg_step_count_get():
    count = math.ceil(personal_model.avg_steps)
    return jsonify(stepCount=count)

@app.get('/api/avg-time-before-sleep')
def avg_time_before_sleep_get():
    time = personal_model.avg_time_before_sleep
    mins, hours = math.modf(time / 3600)
    hours = int(hours)
    mins = math.floor(mins * 60) 
    time = f"{hours}h {mins}mins" if hours > 0 else f"{mins}mins"
    return jsonify(timeBeforeSleep=time)

@app.get('/api/get-dates-past-7-logs')
def dates_past_7_logs_get():
    logs = personal_model.last_7_logs
    return jsonify(past7Logs = logs)
    
@app.get('/api/get-time-asleep-past-7-logs')
def time_asleep_past_7_logs_get():
    time_asleep = personal_model.past_7_logs_time_asleep
    return jsonify(sleepTime7Logs = time_asleep)

@app.get('/api/get-steps-last-7-logs')
def steps_last_7_logs():
    steps = personal_model.last_7_logs_steps
    return jsonify(steps7Logs = steps)

@app.get('/api/get-sleep-quality-last-7-logs')
def sleep_quality_last_7_logs():
    sleep_quality = personal_model.last_7_logs_sleep_quality
    return jsonify(sleepQuality7Logs = sleep_quality)

@app.get('/api/get-last-7-logs-before-sleep')
def time_before_sleep_7_logs():
    time_before_sleep = personal_model.avg_7days_time_before_sleep
    mins, hours = math.modf(time_before_sleep / 3600)
    hours = int(hours)
    mins = math.floor(mins * 60) 
    time_before_sleep = f"{hours}h {mins}mins" if hours > 0 else f"{mins}mins"
    return jsonify(timeBeforeSleep = time_before_sleep)

@app.get('/api/get-last-7-logs-steps')
def steps_7_logs():
    steps = personal_model.avg_7days_steps
    return jsonify(steps=int(steps))

@app.get('/api/get-last-30-logs-steps')
def steps_30_logs():
    steps = personal_model.avg_30days_steps
    return jsonify(steps=int(steps))

@app.get('/api/get-sleep-qualities')
def sleep_qualities():
    sq7 = "%.2f" % round(personal_model.avg_7days_sleep_quality, 2)
    sq30 = "%.2f" % round(personal_model.avg_30days_sleep_quality, 2)
    sleep = [sq7, sq30]
    return jsonify(sleep=sleep)

@app.get('/api/get-last-30-logs-time-before-sleep')
def time_before_sleep_30_logs():
    time_before_sleep = personal_model.avg_30days_time_before_sleep
    mins, hours = math.modf(time_before_sleep / 3600)
    hours = int(hours)
    mins = math.floor(mins * 60) 
    time_before_sleep = f"{hours}h {mins}mins" if hours > 0 else f"{mins}mins"
    return jsonify(timeBeforeSleep=time_before_sleep)

@app.get('/api/get-last-30-logs-time-in-bed')
def time_in_bed_30_logs():
    time_in_bed = personal_model.avg_30days_bedTime
    mins, hours = math.modf(time_in_bed / 3600)
    hours = int(hours)
    mins = math.floor(mins * 60) 
    time_in_bed = f"{hours}h {mins}mins" if hours > 0 else f"{mins}mins"
    return jsonify(timeInBed=time_in_bed)

if __name__ == "__main__":
    app.run(host=ip, debug=True)
