import BenefitCard from "./BenefitCard";

const benefits = [
    {
        "title": "Effortless Email Management",
        "body": "Our AI assistant allows you to send emails on Gmail through simple prompts or voice commands, enhancing your productivity."
    },
    {
        "title": "Seamless Meeting Scheduling",
        "body": "Create meetings in Google Meet effortlessly, ensuring you never miss an important discussion."
    },
    {
        "title": "Task Management Made Easy",
        "body": "Add tasks to Google Tasks quickly and efficiently, keeping your to-do list organized and up-to-date."
    },
    {
        "title": "Instant Messaging on Slack",
        "body": "Send messages on Slack with ease, allowing for smooth communication with your team without the hassle."
    }
]

const Benefits = () => {
    return <div className="my-36 px-4 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg xl:px-28 lg:px-16">
        <span className="font-semibold text-3xl text-gray-900 ">Usecases</span>
        <div className="text-left gap-y-8 flex flex-wrap justify-center items-center mt-8 text-gray-500 sm:justify-between">
            {
                benefits.map((benefit, idx) =>
                    <BenefitCard key={idx} title={benefit.title} body={benefit.body} />
                )
            }
        </div>
    </div>
}

export default Benefits;