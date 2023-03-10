import getAllUsers from "@/lib/getAllUsers";
import { Metadata } from "next";
import Link from "next/link";


export const metadata: Metadata = {
    title: "Users"
}

// pre fetching data before even going to the page
// fetching data just when you hover over the link
// and everything is fetched on the server side on build
export default async function UsersPage() {
    const usersData: Promise<User[]> = getAllUsers();

    const users : User[] = await usersData

    console.log("Hi This is server component rendering")

    const content = (
        <section>
            <h2>
                <Link href="/">Back to Home</Link>
            </h2>
            <br />

            {
                users.map(user => (
                    <>
                    <p key={user.id}>
                        <Link href={`/users/${user.id}`}>{user.name}</Link>
                    </p>
                    </>
                ))
            }
        </section>
    )

    return content
}