import requests
from bs4 import BeautifulSoup
import boto3
import os

# URL of the ESPN College Football Standings page
url = 'https://www.espn.com/college-football/standings'

# Send a GET request to fetch the HTML content
response = requests.get(url)
html_content = response.text

# Parse the HTML content using BeautifulSoup
soup = BeautifulSoup(html_content, 'html.parser')

# Initialize dictionaries to hold team IDs for each conference
conferences = {
    'ACC': [],
    'SEC': [],
    'Big Ten': [],
    'Big 12': []
}

# AWS S3 setup
S3_BUCKET_NAME = "your-s3-bucket-name"
AWS_ACCESS_KEY = "your-access-key"
AWS_SECRET_KEY = "your-secret-key"

# Configure S3 client
s3 = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY
)

# Scraping function
def scrape_player_images(url, school_name):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Adjust based on how ESPN structures their headshot URLs
    image_tags = soup.find_all('img', {'class': 'player-headshot'})  

    for img_tag in image_tags:
        image_url = img_tag['src']
        player_name = img_tag.get('alt', 'unknown-player').replace(' ', '_')
        
        # Download the image
        image_data = requests.get(image_url).content
        file_name = f"{school_name}/{player_name}.jpg"

        # Save to S3
        s3.put_object(
            Bucket=S3_BUCKET_NAME,
            Key=file_name,
            Body=image_data,
            ContentType='image/jpeg'
        )
        print(f"Uploaded {file_name} to S3.")




# Example usage
school_url = "https://www.espn.com/college-football/team/roster/_/id/52"
school_name = "clemson"
scrape_player_images(school_url, school_name)