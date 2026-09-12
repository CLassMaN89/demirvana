// animate-ui.com/docs/icons/list kaynağının JS'e uyarlanmış hâli.
import { motion } from 'motion/react';
import { getVariants, useAnimateIconContext, IconWrapper } from './animateIconTemel';

function yol(gecikme) {
  return {
    initial: { pathLength: 1, opacity: 1, scale: 1 },
    animate: { pathLength: [0, 1], opacity: [0, 1], scale: [1.1, 1], transition: { duration: 0.4, ease: 'easeInOut', delay: gecikme } }
  };
}

const animasyonlar = {
  default: { rect: {}, path1: yol(0), path2: yol(0.2), path3: yol(0.4), path4: yol(0.6), path5: yol(0.8), path6: yol(1) }
};

function ListIkonGovdesi({ size, ...props }) {
  const { durum } = useAnimateIconContext();
  const v = getVariants(animasyonlar);

  return (
    <motion.svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <motion.path d="M3 5h.01" variants={v.path1} initial="initial" animate={durum} />
      <motion.path d="M8 5h13" variants={v.path2} initial="initial" animate={durum} />
      <motion.path d="M3 12h.01" variants={v.path3} initial="initial" animate={durum} />
      <motion.path d="M8 12h13" variants={v.path4} initial="initial" animate={durum} />
      <motion.path d="M3 19h.01" variants={v.path5} initial="initial" animate={durum} />
      <motion.path d="M8 19h13" variants={v.path6} initial="initial" animate={durum} />
    </motion.svg>
  );
}

export default function ListIkon(props) {
  return <IconWrapper icon={ListIkonGovdesi} {...props} />;
}
