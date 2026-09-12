// animate-ui.com/docs/icons/chart-column-decreasing kaynağının JS'e uyarlanmış hâli.
import { motion } from 'motion/react';
import { getVariants, useAnimateIconContext, IconWrapper } from './animateIconTemel';

function sutun(gecikme) {
  return { initial: { opacity: 1 }, animate: { opacity: [0, 1], pathLength: [0, 1], transition: { ease: 'easeInOut', duration: 0.4, delay: gecikme } } };
}

const animasyonlar = {
  default: { path1: sutun(0), path2: sutun(0.3), path3: sutun(0.6), path4: {} }
};

function ChartColumnDecreasingIkonGovdesi({ size, ...props }) {
  const { durum } = useAnimateIconContext();
  const v = getVariants(animasyonlar);

  return (
    <motion.svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <motion.path d="M8 17V5" variants={v.path1} initial="initial" animate={durum} />
      <motion.path d="M13 17V9" variants={v.path2} initial="initial" animate={durum} />
      <motion.path d="M18 17V13" variants={v.path3} initial="initial" animate={durum} />
      <motion.path d="M3 3v16a2 2 0 0 0 2 2h16" variants={v.path4} initial="initial" animate={durum} />
    </motion.svg>
  );
}

export default function ChartColumnDecreasingIkon(props) {
  return <IconWrapper icon={ChartColumnDecreasingIkonGovdesi} {...props} />;
}
