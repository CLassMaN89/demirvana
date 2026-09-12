// animate-ui.com/docs/icons/gallery-horizontal kaynağının JS'e uyarlanmış hâli.
import { motion } from 'motion/react';
import { getVariants, useAnimateIconContext, IconWrapper } from './animateIconTemel';

function kenar(baslangicX) {
  return { initial: { opacity: 1, scale: 1, x: 0 }, animate: { opacity: [0, 1], scale: [0.8, 1], x: [baslangicX, 0], transition: { type: 'spring', stiffness: 150, damping: 15 } } };
}

const animasyonlar = {
  default: { rect: {}, path1: kenar(4), path2: kenar(-4) }
};

function GalleryHorizontalIkonGovdesi({ size, ...props }) {
  const { durum } = useAnimateIconContext();
  const v = getVariants(animasyonlar);

  return (
    <motion.svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <motion.path d="M2 3v18" variants={v.path1} initial="initial" animate={durum} />
      <motion.rect width="12" height="18" x="6" y="3" rx="2" variants={v.rect} initial="initial" animate={durum} />
      <motion.path d="M22 3v18" variants={v.path2} initial="initial" animate={durum} />
    </motion.svg>
  );
}

export default function GalleryHorizontalIkon(props) {
  return <IconWrapper icon={GalleryHorizontalIkonGovdesi} {...props} />;
}
