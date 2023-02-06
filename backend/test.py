import requests

def main():
    resp = requests.get('http://127.0.0.1:5000/api/sleep-quality')
    print(resp.json())

if __name__ == "__main__":
    main()

