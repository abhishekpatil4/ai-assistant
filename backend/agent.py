import os
from composio_crewai import Action, ComposioToolSet
from crewai import Agent, Crew, Task, Process
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime
# from langchain_groq import ChatGroq
from langchain_openai import ChatOpenAI
load_dotenv()

llm = ChatOpenAI(model="gpt-4o")
# llm=ChatGroq(temperature=0,model_name="llama3-70b-8192", api_key='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')
# llm = ChatOpenAI(
#     openai_api_base="https://api.groq.com/openai/v1",
#     openai_api_key="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",
#     model_name="llama-3.1-70b-versatile",
#     temperature=0,
#     max_tokens=1000,
# )
# ComposioToolSet instance
composio_toolset = ComposioToolSet(api_key=os.environ.get("COMPOSIO_API_KEY"))

def perform_task(task_description:str) -> str:
    # Tools
    tools = composio_toolset.get_actions(actions=[Action.GOOGLETASKS_INSERT_TASK, Action.GOOGLEMEET_CREATE_MEET, Action.GMAIL_SEND_EMAIL, Action.GMAIL_CREATE_EMAIL_DRAFT, Action.SLACKBOT_SENDS_A_MESSAGE_TO_A_SLACK_CHANNEL])

    # Agent
    ai_assistant = Agent(
        role="Personal Assistant",
        goal="Can perform tasks like create and send email, add tasks to Google Tasks, create Google Meet links, send message to slack channel",
        backstory="You are a highly capable AI assistant designed to streamline productivity by managing tasks in Google's Gmail, Google Tasks, Google Meet, Slack",
        verbose=True,
        llm=llm,
        tools=tools,
        allow_delegation=False,
    )

    # Task
    # task = Task(
    #     description="Create a new google meet for Client meeting and create a new task in google tasks and store the link in Google the with sheet id: MDMzNTY4MjQ2MTg0NzE1NDYzODE6MDow",
    #     agent=ai_assistant,
    #     expected_output="Perform the task",
    # )
    # task = Task(
    #     description="Create a new google meet for Client meeting and send the meeting link to client email (01fe20bcs047@kletech.ac.in)",
    #     agent=ai_assistant,
    #     expected_output="Perform the task",
    # )
    # task = Task(
    #     description="Send a message to slack channel #dev-channel saying 'Hello World'",
    #     agent=ai_assistant,
    #     expected_output="Perform the task",
    # )
    task = Task(
        description=task_description,
        agent=ai_assistant,
        expected_output="Perform the task",
    )

    # Crew
    scheduler_crew = Crew(
        agents=[ai_assistant],
        tasks=[task],
        verbose=1,
        process=Process.sequential,
    )
    
    result = scheduler_crew.kickoff()
    return result



# Get today's date
# today_date = datetime.now().date()
# perform_task()