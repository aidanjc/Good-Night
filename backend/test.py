import requests
from sleep import get_sleep_data

def main():
    df = get_sleep_data('sleepdata.csv')
    print(df.keys())

if __name__ == "__main__":
    main()

