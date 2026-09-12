// animate-ui.com/docs/icons/message-square-text kaynağının JS'e uyarlanmış hâli.
import { motion } from 'motion/react';
import { getVariants, useAnimateIconContext, IconWrapper } from './animateIconTemel';

const animasyonlar = {
  default: {
    group: { initial: { rotate: 0 }, animate: { transformOrigin: 'bottom left', rotate: [0, 8, -8, 2, 0], transition: { ease: 'easeInOut', duration: 0.8, times: [0, 0.4, 0.6, 0.8, 1] } } },
    path1: {},
    path2: { initial: { opacity: 1, pathLength: 1, pathOffset: 0 }, animate: { opacity: [1, 0, 1], pathLength: [1, 0, 1], pathOffset: [0, 1, 0], transition: { duration: 0.6, ease: 'easeInOut', opacity: { duration: 0.01 } } } },
    path3: { initial: { opacity: 1, pathLength: 1, pathOffset: 0 }, animate: { opacity: [1, 0, 1], pathLength: [1, 0, 1], pathOffset: [0, 1, 0], transition: { duration: 0.6, ease: 'easeInOut', opacity: { duration: 0.01 } } } }
  }
};

function MessageSquareTextIkonGovdesi({ size, ...props }) {
  const { durum } = useAnimateIconContext();
  const v = getVariants(animasyonlar);

  return (
    <motion.svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <motion.g variants={v.group} initial="initial" animate={durum}>
        <motion.path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" variants={v.path1} initial="initial" animate={durum} />
        <motion.path d="M13 8H7" variants={v.path2} initial="initial" animate={durum} />
        <motion.path d="M17 12H7" variants={v.path3} initial="initial" animate={durum} />
      </motion.g>
    </motion.svg>
  );
}

export default function MessageSquareTextIkon(props) {
  return <IconWrapper icon={MessageSquareTextIkonGovdesi} {...props} />;
}
