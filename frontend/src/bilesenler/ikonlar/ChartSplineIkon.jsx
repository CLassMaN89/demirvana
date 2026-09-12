// animate-ui.com/docs/icons/chart-spline kaynağının JS'e uyarlanmış hâli.
import { motion } from 'motion/react';
import { getVariants, useAnimateIconContext, IconWrapper } from './animateIconTemel';

const animasyonlar = {
  default: {
    path1: {},
    path2: {
      initial: { opacity: 1, pathLength: 1 },
      animate: { opacity: [0, 1], pathLength: [0.05, 1], transition: { duration: 0.8, ease: 'easeInOut', opacity: { duration: 0.01 } } }
    }
  }
};

function ChartSplineIkonGovdesi({ size, ...props }) {
  const { durum } = useAnimateIconContext();
  const v = getVariants(animasyonlar);

  return (
    <motion.svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <motion.path d="M3 3v16a2 2 0 0 0 2 2h16" variants={v.path1} initial="initial" animate={durum} />
      <motion.path d="M7 16c.5-2 1.5-7 4-7 2 0 2 3 4 3 2.5 0 4.5-5 5-7" variants={v.path2} initial="initial" animate={durum} />
    </motion.svg>
  );
}

export default function ChartSplineIkon(props) {
  return <IconWrapper icon={ChartSplineIkonGovdesi} {...props} />;
}
