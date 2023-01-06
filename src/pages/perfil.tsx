import { useSession } from "next-auth/react";

export default function Perfil() {
    const { data: session } = useSession();

    console.log(session)

    return (
        <>Oiii</>
    );
}