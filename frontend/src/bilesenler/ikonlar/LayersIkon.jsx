// animate-ui.com/docs/icons/layers kaynağının JS'e uyarlanmış hâli.
import { motion } from 'motion/react';
import { getVariants, useAnimateIconContext, IconWrapper } from './animateIconTemel';

const animasyonlar = {
  default: {
    path1: { initial: { y: 0 }, animate: { y: 5, transition: { duration: 0.3, ease: 'easeInOut' } } },
    path2: {},
    path3: { initial: { y: 0 }, animate: { y: -5, transition: { duration: 0.3, ease: 'easeInOut' } } }
  }
};

function LayersIkonGovdesi({ size, ...props }) {
  const { durum } = useAnimateIconContext();
  const v = getVariants(animasyonlar);

  return (
    <motion.svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <motion.path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" variants={v.path1} initial="initial" animate={durum} />
      <motion.path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" variants={v.path2} initial="initial" animate={durum} />
      <motion.path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" variants={v.path3} initial="initial" animate={durum} />
    </motion.svg>
  );
}

export default function LayersIkon(props) {
  return <IconWrapper icon={LayersIkonGovdesi} {...props} />;
}
