import "@styles/submit.scss";

interface SubmitProps {
    name: string;
}

export default function Submit({ name }: SubmitProps) {
    return <input className="submit" value={name} type="submit" />;
}
