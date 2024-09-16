import ActionButton from "./ActionButton";
import WorkingFlow from "./WorkingFlow";

const Hero = () => {
    return <>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Just say it, let AI do the rest</h1>
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-24 dark:text-gray-400">Enhance your productivity with our AI assistant! Effortlessly send emails on Gmail, create meetings in Google Meet, add tasks to Google Tasks, and send messages on Slack, all through simple prompts or voice commands.</p>
        <WorkingFlow />
        <div className="my-10">
            <ActionButton displayName={"Get started"} link={"#"} />
        </div>
        <iframe className="m-auto md:min-w-[854px] md:min-h-[480px]" src="https://drive.google.com/file/d/1ayesXzHCN1j9zzPh_t8edL7uWquIZg1x/preview" width="640" height="480" allow="autoplay"></iframe>
    </>
}

export default Hero;