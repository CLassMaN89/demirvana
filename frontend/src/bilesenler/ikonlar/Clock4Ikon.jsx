// animate-ui.com/docs/icons/clock-4 kaynağının JS'e uyarlanmış hâli.
import { motion } from 'motion/react';
import { getVariants, useAnimateIconContext, IconWrapper } from './animateIconTemel';

const animasyonlar = {
  default: {
    circle: {},
    line1: {
      initial: { rotate: 0, transition: { ease: 'easeInOut', duration: 0.6 } },
      animate: { transformOrigin: 'top left', rotate: [0, 20, 0], transition: { ease: 'easeInOut', duration: 0.6 } }
    },
    line2: {
      initial: { rotate: 0, transition: { ease: 'easeInOut', duration: 0.6 } },
      animate: { transformOrigin: 'bottom left', rotate: 360, transition: { ease: 'easeInOut', duration: 0.6 } }
    }
  }
};

function Clock4IkonGovdesi({ size, ...props }) {
  const { durum } = useAnimateIconContext();
  const variants = getVariants(animasyonlar);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size} height={size}
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      {...props}
    >
      <motion.circle cx={12} cy={12} r={10} variants={variants.circle} initial="initial" animate={durum} />
      <motion.line x1={12} y1={12} x2={16} y2={14} variants={variants.line1} initial="initial" animate={durum} />
      <motion.line x1={12} y1={6} x2={12} y2={12} variants={variants.line2} initial="initial" animate={durum} />
    </motion.svg>
  );
}

export default function Clock4Ikon(props) {
  return <IconWrapper icon={Clock4IkonGovdesi} {...props} />;
}
