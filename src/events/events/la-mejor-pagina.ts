import { EmbedBuilder, Message, OmitPartialGroupDMChannel } from 'discord.js'
import Event_Builder from '../../structures/event-builder'

export default class LaMejorPagina
  extends Event_Builder<'messageCreate'>
{
  constructor() {
    super({
      eventType: 'messageCreate', type: 'on' , name: 'La Mejor Pagina'
    })
  }

  public event(message: OmitPartialGroupDMChannel<Message<boolean>>) {
    try {
      if (
        message.content.toLowerCase() === 'la mejor pagina' ||
        message.content.toLowerCase() === 'xvideos' ||
        message.content.toLowerCase() === 'lamejorpagina'
      ) {
        const embed = new EmbedBuilder()
          .setTitle('La Mejor Pagina')
          .setDescription(
            `mi nombre es slope y vengo a decir mis porques sobre el tema PORQUE XVIDEOS ES MEJOR PAGIN A QUE CUALQUIER OTRA
            Durante  7 años haciendome pajas que utilizado demasiadas paginas, pero no hay ninguna como xvideos. Los videos que te recomiendan son la hostia. Podras  ver a piper  perri follando con manolo obama hasta ver a tu crush de clase.Todas las categorias estan perfectas. Te recomiendan lo mejor que podras ver en tu vida y os lo juro que es la verdad. Su publico y la gente que se dedica a colocar comentarios es mejor que ver ttv. Puedes encontrarte a bots como Maria madre soltera que quiere sexo  hasta a Juampa que tiene 50  y comenta a Maria para follarsela con comentarios: cuando quieras nena ese culo no se moja solo hermosa.
            Como e dicho antes e estado durante tiempo utilizando muchisimas paginas porno. Para la gente de PORNHUB. No digo q no este mal, pero si os dais cuenta, no recomiendan a tu crush de la escuela sino siempre a mia khalifa y a Eva Elfie. Asi  no se  puede vivir. El interfaz no esta mal. Lo unico que me gusta del ph es que puedes encontrar a las mejores estrellas muy facil. Tambien podemos poner el ejemplo de XNXX. Que PUTISIMA MIERDA ES ESA JODER. Fondo azul que te da asco que tienes mas posibilidades que se te baje que se te suba. Joder y los videos dan pena
            En conclusion XVIDEOS es el mejor porque me gusta`
          )
          .setColor('Blue')
          .setURL('https://www.xvideos.com/')
          .addFields({
            name: 'XVIDEOS',
            value: 'https://www.xvideos.com/',
            inline: true
          })
          .setThumbnail(
            'https://seeklogo.com/images/X/xvideos-logo-77E7B4F168-seeklogo.com.png'
          )
          .setImage(
            'https://1000marcas.net/wp-content/uploads/2019/12/XVideos-Logo.png'
          )
        message.reply({ embeds: [embed] })
      }
    } catch (error) {
      console.log(error)
    }
  }
}
