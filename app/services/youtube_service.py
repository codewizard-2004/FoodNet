from youtube_search import YoutubeSearch
import random

def parse_duration_to_minutes(duration: str) -> int:
    """
    Converts a YouTube duration string (MM:SS or HH:MM:SS) to minutes.
    """
    parts = list(map(int, duration.split(":")))
    if len(parts) == 2:
        minutes, seconds = parts
        return minutes
    elif len(parts) == 3:
        hours, minutes, seconds = parts
        return hours * 60 + minutes
    return 0


def get_cooking_videos(food_name: str, min_minutes: int = 5):
    """
    Fetches a cooking video for a given food item with a minimum duration.

    :param food_name: Name of the food item
    :param min_minutes: Minimum video length in minutes
    :return: Dict with video details or None
    """

    try:
        query = f"how to cook {food_name} in detail"
        results = YoutubeSearch(query, max_results=10).to_dict()

        if not results:
            return None

        # Filter videos by duration
        valid_videos = [
            video for video in results
            if video.get("duration") #type: ignore
            and parse_duration_to_minutes(video["duration"]) >= min_minutes #type: ignore
        ]

        if not valid_videos:
            return None

        video = random.choice(valid_videos)

        return {
            "title": video.get("title"), #type: ignore
            "url": f"https://www.youtube.com/watch?v={video.get('id')}",#type: ignore
            "thumbnail": video.get("thumbnails", [None])[0],#type: ignore
            "duration": video.get("duration")#type: ignore
        }

    except Exception as e:
        print(f"Error fetching videos from YouTube: {e}")
        return None