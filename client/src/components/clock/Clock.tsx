import { cn } from '../../utils/cssUtils'
import { padTime } from '../../utils/timeUtils'
import styles from './clock.module.css'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  hours: number
  minutes: number
  seconds: number
}

export const Clock = ({ hours, minutes, seconds, className, ...props }: Props) => {
  return (
    <>
      <div
        className={cn(
          `${styles.clock} font-sevenseg text-4xl tracking-wide font-extrabold`,
          className
        )}
        {...props}
      >
        <div className="flex justify-center">
          {padTime(hours)}:{padTime(minutes)}:{padTime(seconds)}
        </div>
      </div>
    </>
  )
}

export default Clock
