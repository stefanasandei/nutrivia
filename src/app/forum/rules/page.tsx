import UserAgreement from "@/components/screens/user-agreement";
import { getServerAuthSession } from "@/server/auth";

export default async function ForumRules() {
  const session = await getServerAuthSession();

  return (
    <section className="container grid items-center gap-6 pb-8 pt-2 md:py-5">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Community Guidelines
        </h1>
      </div>
      <div className="space-y-4">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla a
          ornare quam. Mauris lacus risus, posuere in dolor vel, aliquam
          pulvinar tellus. Integer non magna tempor, posuere ante vitae,
          convallis neque. Interdum et malesuada fames ac ante ipsum primis in
          faucibus. Pellentesque habitant morbi tristique senectus et netus et
          malesuada fames ac turpis egestas. Mauris in luctus diam. Nunc
          ultrices leo velit, eget tincidunt dui varius quis. Sed augue mauris,
          mattis vitae condimentum non, vehicula et tellus. Duis non enim
          tortor. In consequat justo iaculis, fermentum orci eu, condimentum
          nisl. Donec consectetur arcu lectus, a blandit dui sodales nec.
          Vivamus laoreet in dui vitae sollicitudin. Mauris erat mauris, mattis
          vitae sodales vitae, vehicula nec nisl. Phasellus eu lorem rutrum,
          vehicula risus ac, tempus augue. Sed mi lorem, laoreet eget luctus sit
          amet, molestie id turpis. Duis ultricies ligula eget nulla lobortis
          pellentesque. Sed nec hendrerit turpis. Etiam lacinia sem at tempus
          mollis. Sed facilisis ultricies diam eu mollis. Donec sed pulvinar
          orci, vel convallis sapien. Phasellus eu velit eu quam dictum
          convallis nec a dui. Fusce tellus justo, vestibulum tristique ornare
          volutpat, aliquam aliquet lorem. Aliquam erat volutpat. Suspendisse ac
          libero nec lorem faucibus sagittis sit amet a sapien. Duis luctus
          tellus ex, eu dignissim enim vestibulum eget. Nunc ut semper quam. Sed
          interdum ligula et erat vehicula pellentesque. Quisque congue odio et
          ligula bibendum faucibus. Fusce eleifend at purus at tristique.
          Vivamus dapibus purus vitae dui aliquam, id lacinia sapien finibus. In
          at euismod velit. Quisque at dui ut turpis pulvinar mollis non
          dignissim ligula. Nunc consectetur orci a dui scelerisque volutpat.
          Nulla ut odio lacus. Vestibulum luctus urna libero, sit amet tristique
          nibh rutrum ac. Suspendisse suscipit sit amet quam vel ullamcorper. In
          id quam varius tellus dapibus faucibus a non ligula. In ultricies
          fermentum tellus. Nulla molestie eget leo vel feugiat. Aenean vitae
          magna bibendum, hendrerit dui in, tempor diam. Sed sed arcu et sapien
          ullamcorper commodo at nec neque. Proin pellentesque at ex ac gravida.
          Duis non fermentum lorem. Duis at lobortis ipsum. Nulla facilisi.
          Quisque ultrices faucibus ex quis pellentesque. Cras tristique leo
          eget libero interdum fringilla. Aenean bibendum nibh eget volutpat
          vestibulum.
        </p>
        {session != null && <UserAgreement user={session.user} />}
      </div>
    </section>
  );
}
