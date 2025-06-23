import AddDocumentBtn from "@/components/AddDocumentBtn";
import Header from "@/components/Header"
import { SignedIn, UserButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

const Home = async () => {
    const clearkUser = await currentUser();
    if (!clearkUser) redirect('/sign-in');

    const documents = [];

    return (
        <main className="home-container">
            <Header className="sticky left-0 top-0">
                <div className="flex items-center gap=2 lg:gap-4">
                    Notification

                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </Header>

            {documents.length > 0 ? (
                <div>da</div>
            ) : (
                <div className="document-list-empty">
                    <Image
                        src={'/icons/doc.svg'}
                        alt={'Document'}
                        width={40}
                        height={40}
                        className="mx-auto"
                    />

                    <AddDocumentBtn
                        userId={clearkUser.id}
                        email={clearkUser.emailAddresses[0]?.emailAddress || ''}
                    />
                </div>
            )}
        </main>
    )
}

export default Home