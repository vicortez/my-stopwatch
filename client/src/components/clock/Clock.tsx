import { cn } from '../../utils/cssUtils'
import styles from './clock.module.css'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  hours: number
  minutes: number
  seconds: number
}

export const Clock = ({ hours, minutes, seconds, className, ...props }: Props) => {
  const formatTime = (time: number) => time.toString().padStart(2, '0')

  return (
    <>
      <div
        className={cn(
          `${styles.clock} font-sevenseg text-4xl tracking-wide font-extrabold`,
          className
        )}
        {...props}
      >
        <span>
          {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
        </span>
      </div>
    </>
  )
}

export default Clock
