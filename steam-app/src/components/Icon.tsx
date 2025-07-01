type Props = {
    imageUrl: string;
}
export default function Icon({ imageUrl}: Props) {
    return (
        <img src={imageUrl} width={30}></img>
    )
}