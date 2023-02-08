
import pandas as pd
import numpy as np
import time

class SleepData:
    def __init__(self, df):
        self.df = df
        self.avg_bedTime = df["Time in bed (seconds)"].mean()
        self.avg_30days_bedTime = df["Time in bed (seconds)"].iloc[-30:].mean()
        self.avg_7days_bedTime = df["Time in bed (seconds)"].iloc[-7:].mean()
        self.yesterday_bedTime = df["Time in bed (seconds)"].iloc[-1:].mean()
        #Time before sleep
        #Avg overall time before sleep
        self.avg_time_before_sleep = df["Time before sleep (seconds)"].mean()
        #Avg last 30 days time before sleep
        self.avg_30days_time_before_sleep = df["Time before sleep (seconds)"].iloc[-30:].mean()
        #Avg last 7 days time before sleep
        self.avg_7days_time_before_sleep = df["Time before sleep (seconds)"].iloc[-7:].mean()
        #Avg overall time before sleep
        self.yesterday_time_before_sleep = df["Time before sleep (seconds)"].iloc[-1:].mean()

        #Steps

        #Avg overall steps
        self.avg_steps = df["Steps"].mean() # There are several days the steps are 0
        #Avg last 30 days steps
        self.avg_30days_steps = df["Steps"].iloc[-30:].mean() 
        #Avg last 7 days steps
        self.avg_7days_steps = df["Steps"].iloc[-7:].mean() 
        #Yesterday's steps
        self.yesterday_steps = df["Steps"].iloc[-1:].mean() 

        #Sleep quality

        #Avg last 30 days sleep quality
        self.avg_30days_sleep_quality = df["Sleep Quality"].iloc[-30:].str.rstrip("%").astype(float).mean()
        #Avg last 7 days sleep quality
        self.avg_7days_sleep_quality = df["Sleep Quality"].iloc[-7:].str.rstrip("%").astype(float).mean()
        #Yesterday sleep quality
        self.yesterday_sleep_quality = df["Sleep Quality"].iloc[-1:].str.rstrip("%").astype(float).mean()

    # 1 sleep cycle = 90 mins = 5400 s
    # 6 cycles, 9h of sleep = 32400s - recommended for long-sleepers 
    # 5 cycles, 7h30m of sleep = 27000s - recommended for average-sleepers
    # 4 cycles, 6h of sleep - recommended for short-sleepers
    def idealSleepTime(self, sleeper,sleep_duration):
        message = ""
        if(sleeper == 1 ):
            message+="We determine you as a short sleeper. "
            if(sleep_duration<= 18000):                     #less than 5 hr of sleep
                message+="You didn't get enough sleep last night. Try to get at least 6h of sleep(4 sleep cycles)."
            else:
                message+="Keep up with your current sleep routine."
        elif(sleeper == 2):
            message+="We determine you as an average sleeper. "
            if(sleep_duration<= 23400):                      #less than 6 hr and 30 mins of sleep
                message+="You didn't get enough sleep last night. Try to get at least 7h and 30 mins of sleep(5 sleep cycles)."
            else:
                message+="Keep up with your current sleep routine."
        else:
            message+="We determine you as a long sleeper. "
            if(sleep_duration<= 28800):                      #less than 8 hr of sleep
                message+="You didn't get enough sleep last night. Try to get at least 9h of sleep(6 sleep cycles)."
            else:
                message+="Keep up with your current sleep routine."
        return message
    
    

    def get_sleep_recommendations(self):
        """
        Returns a list of recommendations for sleeping better ranked in order of importance
        
        Parameters
        ----------
        sleep_data : pandas.DataFrame
            DataFrame containing sleep data
    
        Returns
        -------
        list of str
            List of recommendations for sleeping better ranked in order of importance
        """
        # Check for missing values in sleep_data
        #if sleep_data.isnull().values.any():
        #    return ["Error: Missing values in input data. Please check your data and try again."]
        
        #determine what kind of sleeper the user is based on prev sleep_duration data
        # 1:short-sleeper, 2:average-sleeper, 3:long-sleeper, by default sleeper = 2
        sleeper = -1
        if(len(self.df)<7):
            sleeper = 2
        else:
            if(self.df["Time asleep (seconds)"].iloc[-7:].mean()>=28800):
                sleeper = 3
            elif(self.df["Time asleep (seconds)"].iloc[-7:].mean()>=23400):
                sleeper = 2
            else:
                sleeper = 1
        # Analyze sleep data and create recommendations
        recommendations = []
        
        # 1. give recommendation based on sleeper type and sleep duration
        recommendations.append(self.idealSleepTime(sleeper,df["Time asleep (seconds)"].iloc[-1:].mean()))
        
        # 2. give recommendation for bedtime
        
        # 3. give recommendations from List of items and exercises that help with sleep
        
        recommendations.append("1.Get some sunlight during the day.")
        recommendations.append("2.Meditate before bed.")
        recommendations.append("3.Avoid large meals before bed.")
        recommendations.append("4.Avoid naps during the day.")
        recommendations.append("5.Avoid electronics before bed")
        
        return recommendations



    


    def showHistogram(self,x_axis_label,y_axis_label):
        temp = self.df
        dataFrameLength = len(temp)
        #print(dataFrameLength)
        
        hist = temp.plot(kind = "bar",x=x_axis_label, y = y_axis_label ,legend = False)
        hist.set_title(y_axis_label)
        hist.set_xlabel("")

