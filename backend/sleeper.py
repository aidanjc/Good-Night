# sleeper.py
import pandas as pd
import numpy as np
import time


# convert sleep data csv to pandas dataframe
def get_sleep_data(fp):
    data = pd.read_csv(fp, sep = ';')
    sleep_df = pd.DataFrame(data)
    sleep_df['day_of_week'] = pd.to_datetime(sleep_df['End']).dt.dayofweek
    sleep_df['MM-DD'] = pd.to_datetime(sleep_df['End']).dt.strftime('%m-%d')
    days = {0:'Mon',1:'Tue',2:'Wed',3:'Thu',4:'Fri',5:'Sat',6:'Sun'}
    sleep_df['day_of_week'] = sleep_df['day_of_week'].apply(lambda x: days[x])
    return sleep_df

# convert food data csv to pandas dataframe
def get_food_data(fp):
    data = pd.read_csv(fp)
    food_df = pd.DataFrame(data)
    return food_df


class PersonalModel:
    def __init__(self, sleep_df, food_df):
        # Data
        self.sleep_df = sleep_df
        self.food_df = food_df

        # Personal
        # User input
        self.gender = ""
        self.breakfast_calories = 0
        self.lunch_calories = 0
        self.is_vegetarian = False
        self.height = 0
        self.weight = 0
        self.age = 0
        # Derived
        self.sleeper = None
        self.active_level = None
        self.remaining_calories_needed = None
        self.ideal_bedtime = None

        # Bed Time
        self.avg_bedTime = sleep_df["Time in bed (seconds)"].mean()
        self.avg_30days_bedTime = sleep_df["Time in bed (seconds)"].iloc[-30:].mean()
        self.avg_7days_bedTime = sleep_df["Time in bed (seconds)"].iloc[-7:].mean()
        self.yesterday_bedTime = sleep_df["Time in bed (seconds)"].iloc[-1:].mean()

        #Time before sleep
        #Avg overall time before sleep
        self.avg_time_before_sleep = sleep_df["Time before sleep (seconds)"].mean()
        #Avg last 30 days time before sleep
        self.avg_30days_time_before_sleep = sleep_df["Time before sleep (seconds)"].iloc[-30:].mean()
        #Avg last 7 days time before sleep
        self.avg_7days_time_before_sleep = sleep_df["Time before sleep (seconds)"].iloc[-7:].mean()
        #Avg overall time before sleep
        self.yesterday_time_before_sleep = sleep_df["Time before sleep (seconds)"].iloc[-1:].mean()
        
        # Time Asleep
        # Time Asleep yesterday (seconds)
        self.yesterday_time_asleep_s = sleep_df["Time asleep (seconds)"].iloc[-1]
        # Time Asleep yesterday (hours/mins)
        self.yesterday_time_asleep_hm = time.strftime(
                '%Hh %Mm', time.gmtime(self.yesterday_time_asleep_s))
        # Time Asleep for the past 7 logs (seconds)
        self.past_7_logs_time_asleep = [time_slept/3600 for time_slept in sleep_df["Time asleep (seconds)"].iloc[-7:-1]]
        
        # Dates for past 7 logs
        self.last_7_logs = ["/".join([str(int(log.split("-")[1])), str(int(log.split("-")[2][:2]))]) for log in sleep_df["Start"].iloc[-7:]]

        # Sleep Start (Time Went to Bed)
        # Sleep Start yesterday
        self.yesterday_sleep_start = sleep_df["Start"].iloc[-1].split(" ")[1][:-3]
        
        # Sleep End (Time Woke Up)
        # Sleep End yesterday
        self.yesterday_sleep_end = sleep_df["End"].iloc[-1].split(" ")[1][:-3]

        #Steps

        #Avg overall steps
        self.avg_steps = sleep_df["Steps"].mean() # There are several days the steps are 0
        #Avg last 30 days steps
        self.avg_30days_steps = sleep_df["Steps"].iloc[-30:].mean() 
        #Avg last 7 days steps
        self.avg_7days_steps = sleep_df["Steps"].iloc[-7:].mean() 
        #Yesterday's steps
        self.yesterday_steps = sleep_df["Steps"].iloc[-1:].mean() 
        # Last 7 logs steps
        self.last_7_logs_steps = [steps for steps in sleep_df["Steps"].iloc[-7:]]

        #Sleep quality

        #Avg last 30 days sleep quality
        self.avg_30days_sleep_quality = sleep_df["Sleep Quality"].iloc[-30:].str.rstrip("%").astype(float).mean()
        #Avg last 7 days sleep quality
        self.avg_7days_sleep_quality = sleep_df["Sleep Quality"].iloc[-7:].str.rstrip("%").astype(float).mean()
        #Yesterday sleep quality
        self.yesterday_sleep_quality = sleep_df["Sleep Quality"].iloc[-1:].str.rstrip("%").astype(float).mean()
        # Last 7 logs sleep quality
        self.last_7_logs_sleep_quality = [quality for quality in sleep_df["Sleep Quality"].iloc[-7:].str.rstrip("%").astype(float)]

    def get_signup_data(self, gender, breakfast_calories, lunch_calories, diet, height, weight, age):
        # set user's gender
        if gender == "Male":
            self.gender = "Male"
        else:
            self.gender = "Female"
        
        self.breakfast_calories = breakfast_calories # set user breakfast calories
        self.lunch_calories = lunch_calories # set user lunch calories
        
        # set user's diet (Non-Vegetarian default)
        if diet == "Vegetarian":
            self.is_vegetarian = True
        
        self.height = height # set user height
        self.weight = weight # set user weight
        self.age = age # set user age

    def update_personal_data(self, gender, diet, height, weight, age):
        # update user's gender
        if gender == "Male":
            self.gender = "Male"
        else:
            self.gender = "Female"

        # update user's diet (Non-Vegetarian default)
        if diet == "Vegetarian":
            self.is_vegetarian = True
        
        self.height = height # update user height
        self.weight = weight # update user weight
        self.age = age # update user age
        

    def get_ideal_sleep_time(self):
        """
        1 sleep cycle = 90 mins = 5400 s
        6 cycles, 9h of sleep = 32400s - recommended for long-sleepers 
        5 cycles, 7h30m of sleep = 27000s - recommended for average-sleepers
        4 cycles, 6h of sleep - recommended for short-sleepers
        """
        message = ""
        if(self.sleeper == 1 ):
            message+="We determine you as a short sleeper. "
            if(self.yesterday_time_asleep_s <= 18000):                     #less than 5 hr of sleep
                message+="You didn't get enough sleep last night. Try to get at least 6h of sleep(4 sleep cycles)."
            else:
                message+="Keep up with your current sleep routine."
        elif(self.sleeper == 2):
            message+="We determine you as an average sleeper. "
            if(self.yesterday_time_asleep_s <= 23400):                      #less than 6 hr and 30 mins of sleep
                message+="You didn't get enough sleep last night. Try to get at least 7h and 30 mins of sleep(5 sleep cycles)."
            else:
                message+="Keep up with your current sleep routine."
        else:
            message+="We determine you as a long sleeper. "
            if(self.yesterday_time_asleep_s <= 28800):                      #less than 8 hr of sleep
                message+="You didn't get enough sleep last night. Try to get at least 9h of sleep(6 sleep cycles)."
            else:
                message+="Keep up with your current sleep routine."
        return message
    
    
    def get_active_level(self):
        """
        Determine how active a user is
        Sedentary - less than 2,500 steps per day 
        Lightly active - 2,500 to 4,999 steps per day
        Moderately active - 5,000 to 7,499 steps per day
        Very active - more than 7,499 steps per day
        Extra active - more than 10,000 

        Returns
        -------
        Activity Level (int)
        """
        activeLevel = None
        activeScore = 0
        if(len(self.sleep_df) <7):
            activeLevel = 2
        else:
            for i in (self.sleep_df["Steps"].iloc[-7:]):
                if(i<=2500):
                    activeScore += 1
                elif(i<=4999):
                    activeScore += 2
                elif(i<=7499):
                    activeScore += 3
                elif(i<=10000):
                    activeScore += 4
                else:
                    activeScore += 5
            activeLevel = round(activeScore/7)
        return activeLevel


    def get_calories_needed_for_dinner(self):
        BMR = None
        daily_calories_needed = None
        if(self.gender == "male"):
            BMR = 66.5 + (13.75 * self.weight) + (5.003 * self.height) - (6.75 * self.age)
        else:
            BMR = 655.1 + (9.563 * self.weight) + (1.850 * self.height) - (4.676 * self.age)
        
        if(self.active_level == 1):
            daily_calories_needed = BMR*1.2
        elif(self.active_level == 2):
            daily_calories_needed = BMR*1.375
        elif(self.active_level == 3):
            daily_calories_needed = BMR*1.55
        elif(self.active_level == 4):
            daily_calories_needed = BMR*1.725
        else:
            daily_calories_needed = BMR*1.9
        
        remaining_calories = daily_calories_needed - self.breakfast_calories - self.lunch_calories
            
        return remaining_calories
        
    def get_sleeper(self):
        """
        Determine what kind of sleeper the user is based on prev sleep_duration data
        1: short-sleeper
        2: average-sleeper
        3: long-sleeper
        Default: 2 (average-sleeper)
        """
        sleeper = None
        if(len(self.sleep_df)<7):
            sleeper = 2
        else:
            if(self.sleep_df["Time asleep (seconds)"].iloc[-7:].mean()>=28800):
                sleeper = 3
            elif(self.sleep_df["Time asleep (seconds)"].iloc[-7:].mean()>=23400):
                sleeper = 2
            else:
                sleeper = 1
        return sleeper

    def get_ideal_bed_time(self):
        hour_needed = 0;
        if(self.sleeper == 1):
            hour_needed = 6
        elif(self.sleeper == 2):
            hour_needed = 7.5
        else:
            hour_needed = 9
        
        seconds_needed = hour_needed * 60*60
        seconds_wake_up = sum(x*int(t) for x,t in zip([3600,60], self.yesterday_sleep_end.split(":")))
        seconds_time_before_sleep = self.avg_7days_time_before_sleep
        # time go to bed = time wake up - recommended sleep duration - time before sleep
        seconds_bedTime = seconds_wake_up - seconds_needed - seconds_time_before_sleep
        if(seconds_bedTime < 0):
            seconds_bedTime = seconds_bedTime + 24*60*60
        ideal_bedTime = time.strftime('%H:%M:%S',time.gmtime(round(seconds_bedTime/60)*60))      
        return ideal_bedTime
    
    def get_ideal_daily_steps(self):
        recoms = []
        if(self.active_level == 1):
            recoms.append("We determine you as a Sedentary person.")
            if(self.yesterday_steps <2500):
                recoms.append("Let's have 3750 steps today to keep your body active!")
                return recoms
        elif(self.active_level == 2):
            recoms.append("We determine you as a Lightly active person.")
            if(self.yesterday_steps <5000):
                recoms.append("Let's have 6250 steps today to keep your body active!")
                return recoms
        elif(self.active_level == 3):
            recoms.append("We determine you as a Moderately active person.")
            if(self.yesterday_steps <7500):
                recoms.append("Let's have 8750 steps today to keep your body active!")
                return recoms
        elif(self.active_level == 4):
            recoms.append("We determine you as a Very active person.")
            if(self.yesterday_steps <10000):
                recoms.append("Let's have 10000 steps today to keep your body active!")
                return recoms
        else:
            recoms.append("We determine you as an Extra active person.")
        recoms.append("The number of steps you had yesterday matches your active level. Try to keep it up today!")
        return recoms

    def remaining_time_until_bedtime(self):
        t = time.localtime()
        current_time_str = time.strftime("%H:%M:%S",t)
        current_time = sum(x*int(t) for x,t in zip([3600,60,1], current_time_str.split(":")))
        bd_time = sum(x*int(t) for x,t in zip([3600,60,1], self.ideal_bedtime.split(":")))
        
        time_until_bedTime = bd_time - current_time
        if(time_until_bedTime < 0):
            time_until_bedTime = time_until_bedTime + (24*60*60)
        
        return time_until_bedTime

    def build_personal_model(self):
        self.sleeper = self.get_sleeper()
        self.active_level = self.get_active_level()
        self.remaining_calories_needed = int(self.get_calories_needed_for_dinner()) 
        self.ideal_bedtime = str(self.get_ideal_bed_time())

    def get_sleep_recommendations(self):
        """
        Returns a list of recommendations for sleeping better ranked in order of importance
        
        Returns
        -------
        list of str
            List of recommendations for sleeping better ranked in order of importance
        """
        # Analyze sleep data and create recommendations
        sleep_recommendations = []

        if(len(self.sleep_df)==0):
            return sleep_recommendations
        
        # 1. sleep Section: sleeptime, bedtime
        sleep_recommendations.append(self.get_ideal_sleep_time())
        sleep_recommendations.append(
                "Your ideal bedtime is " 
                + self.ideal_bedtime 
                + ". Give yourself at least 30 mins to prepare for sleep."
                )
        
        # 3. give recommendations from List of items and exercises that help with sleep
        #recommendations.append("1.Get some sunlight during the day.")
        #recommendations.append("2.Meditate before bed.")
        #recommendations.append("3.Avoid large meals before bed.")
        #recommendations.append("4.Avoid naps during the day.")
        #recommendations.append("5.Avoid electronics before bed")
        
        return sleep_recommendations


    def get_diet_recommendations(self, number_foods=7):
        """
        Recommends foods that are below remaining_calories_needed
        If user is vegetarian, the method will only recommend vegetarian food.
        If the remaining time until bed is longer than 5 hrs, 
        recommend any type of food. (Enough time to digest heavy meals).
        If the remaining time until bed is between 4 and 5 hrs, 
        recommend light food (healthy type for non veg user).
        If the remaining time until bed is less than 3 hrs, 
        no food is recommended.
        This method recommends 7 foods from dataframe sorted by calories.
        """
        # Analyze data and create diet recommendations
        food_name_list =[]
        food_calories_list =[]
        food_time_list =[]
        food_ingredients_list =[]
        food_steps_list =[]
        time_until_bed = self.remaining_time_until_bedtime()   
        temp_foodDF = self.food_df.sort_values('calories',ascending = False)
        temp_foodDF = temp_foodDF[(temp_foodDF['calories'] <= (self.remaining_calories_needed)) & (temp_foodDF["minutes"] <= 120)] 
        temp_foodDF = temp_foodDF.reset_index(drop = True) # drop the existing index
        
        if(self.is_vegetarian == True):
            temp_foodDF = temp_foodDF[(temp_foodDF['food types'] =='Veg') | (temp_foodDF['food types'] =='Veg dessert') ]
            temp_foodDF = temp_foodDF.reset_index(drop = True) # drop the existing index
        # >=5hrs     
        if(time_until_bed >= (5*60*60)):
            for i in range (0,number_foods):
                food_name_list.append(temp_foodDF["name"][i])
                food_calories_list.append(temp_foodDF["calories"][i])
                food_time_list.append(temp_foodDF["minutes"][i])
                food_ingredients_list.append(temp_foodDF["ingredients"][i])
                food_steps_list.append(temp_foodDF["steps"][i])
        # >=4hr
        elif(time_until_bed>=(4*60*60)):
            if(self.is_vegetarian == False):
                temp_foodDF =temp_foodDF[temp_foodDF['food types'] =='Healthy']
                temp_foodDF = temp_foodDF.reset_index(drop = True) # drop the existing index
            for i in range (0,number_foods):
                food_name_list.append(temp_foodDF["name"][i])
                food_calories_list.append(temp_foodDF["calories"][i])
                food_time_list.append(temp_foodDF["minutes"][i])
                food_ingredients_list.append(temp_foodDF["ingredients"][i])
                food_steps_list.append(temp_foodDF["steps"][i])

        diet_recommendations = []

        diet_recommendations.append(
                "Your recommended calories intake for today is "
                + str(self.remaining_calories_needed)
                + " kcals."
                )
        #if the current time is close to the bedtime, no recommendation for food     
        if(self.remaining_time_until_bedtime() <=(3*60*60)):
            diet_recommendations.append("It's too late for you to have dinner. You can eat some snacks. (Experts recommend waiting at least three hours after you’ve eaten to go to bed. This allows your body time to digest your food so you’re not up at night with an upset stomach, indigestion, or acid reflux. And it helps you stay asleep.)")
        else:
            diet_recommendations.append("List of food/recipes you might interested based on your preference: \n")
            for i in range (0,number_foods):
                diet_recommendations.append(str(i+1)+". "+str(food_name_list[i])+". " +str(food_calories_list[i]) +" kcals. " 
                                                   +str(food_time_list[i])+" minutes to cook.")
        
        return diet_recommendations


    def get_exercise_recommendations(self):
        """
        Returns a list of recommendations for exercise ranked in order of importance
        
        Returns
        -------
        list of str
            List of recommendations for diet ranked in order of importance
        """
        # Analyze data and create exercise recommendations
        exercise_recommendations = []

        if(len(self.sleep_df)==0):
            return exercise_recommendations 
         
        exercise_recommendations = self.get_ideal_daily_steps()

        return exercise_recommendations 
