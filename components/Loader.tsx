import Image from "next/image"

const Loader = () => {
    return (
        <div className={"loader"}>
            <Image
                src={"/icons/loader.svg"}
                alt={"loader"}
                width={32}
                height={32}
                className="animate-spin"
                priority
            />

            Loading...
        </div>
    )
}

export default Loader;