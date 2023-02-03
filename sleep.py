import pandas as pd

file = open("sleep-data/sleepdata.csv")

def get_sleep_recommendations(sleep_data):
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
    if sleep_data.isnull().values.any():
        return ["Error: Missing values in input data. Please check your data and try again."]
    
    # Analyze sleep data and create recommendations
    recommendations = []
    
    # 1. Check sleep duration
    avg_sleep_duration = sleep_data['sleep_duration'].mean()
    if avg_sleep_duration < 7:
        recommendations.append("Get at least 7 hours of sleep per night.")
    
    # 2. Check bedtime consistency
    avg_bedtime_diff = (sleep_data['bedtime'].diff().abs().mean()) / pd.Timedelta(hours=1)
    if avg_bedtime_diff > 2:
        recommendations.append("Try to maintain a consistent bedtime schedule.")
    
    return recommendations

get_sleep_recommendations(file)