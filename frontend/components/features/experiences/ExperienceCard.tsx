import { ExperienceType } from "@/types/Experience";
import Image from "next/image";
import Link from "next/link";
const ExperienceCard = ({ experience }: { experience: ExperienceType }) => {
  return (
    <div className="bg-[#F0F0F0] rounded-lg">
      <div className="h-60 md:h-64 lg:h-72 flex flex-col items-center">
        {/* Image part */}
        <div className="h-1/2 w-full">
          <Image
            src={experience.images[0]}
            alt="Image"
            width={300}
            height={300}
            className="w-full h-full object-cover rounded-t-lg"
          />
        </div>
        {/* Content part */}
        <div className="w-full h-full flex flex-col justify-between items-center p-3">
          <div className="flex justify-between items-center gap-2 w-full">
            <div className="w-full text-start">
              <h3 className="text-sm xl:text-base font-semibold">
                {experience.name}
              </h3>
            </div>
            <div className="text-xs text-nowrap py-1 px-2 font-semibold text-center rounded-sm bg-[#D6D6D6]">
              {experience.location.split(", ")[0]}
            </div>
          </div>
          <p className="text-start w-full text-xs text-[#6C6C6C]">
            {experience.description}
          </p>
          <div className="flex justify-between items-center gap-2 w-full">
            <span className="text-xs flex justify-center gap-1 items-center">
              From{" "}
              <span className="text-[1rem] font-semibold">
                ₹{experience.price}
              </span>
            </span>
            <Link href={`/experiences/${experience._id}`}>
              <button className="btn-primary">View Details</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
