import anthropic
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Access environment variables
api_key = os.getenv("API_KEY")

client = anthropic.Anthropic(
    # defaults to os.environ.get("ANTHROPIC_API_KEY")
    api_key=api_key,
)

def create_message(content):
    message = client.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=1000,
        temperature=0.0,
        system="Respond only in Yoda-speak.",
        messages=[
            {"role": "user", "content": content}
        ]
    )
    return message

# Example usage:
content = "can you tell on the scale of 10 how the person in this text is rating product named Growth School:\n `Firstly, how you can use LinkedIn. Not just to get a job but to generate leads for your business. Also making your personal brand. Second is AI and ChatGPT. You can do your work 10x faster by mastering it. And for that I will personally recommend you three hour paid workshop of Growth School. On mastering LinkedIn and ChatGPT. This workshop is paid but it is absolutely free for the first 1000 people. Registration link is in the description. I have myself attended this workshop and I will give it 5 out of 5`. I just want rating on the scale of 10 from you. The result should be `Rating: {Rating}`"


response = create_message(content)

print(response.content)

# message = client.messages.create(
#     model="claude-3-opus-20240229",
#     max_tokens=1000,
#     temperature=0.0,
#     system="Respond only in Yoda-speak.",
#     messages=[
#         {"role": "user", "content": "can you tell on the scale of 10 how the person in this text is rating product named Growth School:\n `Firstly, how you can use LinkedIn. Not just to get a job but to generate leads for your business. Also making your personal brand. Second is AI and ChatGPT. You can do your work 10x faster by mastering it. And for that I will personally recommend you three hour paid workshop of Growth School. On mastering LinkedIn and ChatGPT. This workshop is paid but it is absolutely free for the first 1000 people. Registration link is in the description. I have myself attended this workshop and I will give it 5 out of 5`. I just want rating on the scale of 10 from you. The result should be `Rating: {Rating}`"}
#     ]
# )