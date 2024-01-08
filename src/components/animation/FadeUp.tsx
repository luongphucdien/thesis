import { motion } from "framer-motion"
import { fadeUp } from "../../anim-variants/AnimVariants"

export const FadeUp = ({ children }: React.PropsWithChildren) => {
    return (
        <motion.div
            variants={fadeUp}
            initial="start"
            whileInView="end"
            transition={{ duration: 0.4 }}
        >
            {children}
        </motion.div>
    )
}
