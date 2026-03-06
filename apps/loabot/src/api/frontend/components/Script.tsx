import { FC } from "hono/jsx";

interface ScriptProps {
    src: `static/scripts/${string}.js`;
    type?: ScriptType;
}

type ScriptType = "module" | "importmap" | "text/javascript"

const Script: FC<ScriptProps> = ({ src, type = "module"}) => {
    return (
        <script src={`/${src}`} type={type}>
        </script>
    );
};

export default Script;