const Working = () => {
    return <div className="my-36 px-4 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-28">
        <span className="font-semibold text-3xl text-gray-900">Enhance Your Productivity with Our AI Assistant!</span>
        <div className="text-left text-xl gap-y-8 flex flex-wrap justify-center items-center mt-16 text-gray-500 sm:justify-between">
            <ol className="space-y-6 text-gray-500 list-decimal list-inside dark:text-gray-400">
                <li className="flex items-start">
                    <span className="font-semibold text-gray-900 dark:text-white w-full md:w-1/3 mb-2 md:mb-0">Effortlessly Send Emails:</span>
                    <span className="flex-1">Connect your Gmail account and use simple prompts or voice commands to send emails quickly and efficiently.</span>
                </li>
                <li className="flex items-start">
                    <span className="font-semibold text-gray-900 dark:text-white w-full md:w-1/3 mb-2 md:mb-0">Create Meetings in Google Meet:</span>
                    <span className="flex-1">Schedule meetings effortlessly by connecting your Google Meet account and letting the AI handle the details.</span>
                </li>
                <li className="flex items-start">
                    <span className="font-semibold text-gray-900 dark:text-white w-full md:w-1/3 mb-2 md:mb-0">Add Tasks to Google Tasks:</span>
                    <span className="flex-1">Easily manage your to-do list by adding tasks through simple commands, keeping everything organized.</span>
                </li>
                <li className="flex items-start">
                    <span className="font-semibold text-gray-900 dark:text-white w-full md:w-1/3 mb-2 md:mb-0">Send Messages on Slack:</span>
                    <span className="flex-1">Communicate with your team seamlessly by sending messages on Slack using voice commands or prompts.</span>
                </li>
            </ol>
        </div>
    </div>
}

export default Working;