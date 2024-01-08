import { motion } from "framer-motion"
import { fadeIn } from "../../anim-variants/AnimVariants"

export const FadeIn = ({ children }: React.PropsWithChildren) => {
    return (
        <motion.div
            variants={fadeIn}
            initial="start"
            whileInView="end"
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
        >
            {children}
        </motion.div>
    )
}
